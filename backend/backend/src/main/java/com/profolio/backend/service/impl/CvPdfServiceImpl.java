package com.profolio.backend.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.profolio.backend.dto.request.*;
import com.profolio.backend.service.CvPdfService;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class CvPdfServiceImpl implements CvPdfService {

    @Override
    public byte[] generateCvPdf(CvExportRequestDto request) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Color de acento
            Color primaryColor = parseColorHex(request.getEstilos() != null ? request.getEstilos().getColor() : "#006654");
            Color textColor = new Color(31, 41, 55); // #1F2937
            Color secondaryColor = new Color(75, 85, 99); // #4B5563

            // Fuentes
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, primaryColor);
            Font roleFont = FontFactory.getFont(FontFactory.HELVETICA, 13, secondaryColor);
            Font contactFont = FontFactory.getFont(FontFactory.HELVETICA, 9, secondaryColor);
            Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, primaryColor);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, textColor);
            Font bodyBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, textColor);
            Font dateFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, secondaryColor);

            PersonalInfoDto personal = request.getPersonal();
            if (personal != null) {
                // Nombre completo
                String nombreCompleto = (personal.getNombre() != null ? personal.getNombre() : "") + " " + (personal.getApellido() != null ? personal.getApellido() : "");
                Paragraph pNombre = new Paragraph(nombreCompleto.trim(), nameFont);
                document.add(pNombre);

                // Título Profesional
                if (personal.getTitulo() != null && !personal.getTitulo().isBlank()) {
                    Paragraph pTitulo = new Paragraph(personal.getTitulo(), roleFont);
                    pTitulo.setSpacingAfter(6);
                    document.add(pTitulo);
                }

                // Datos de Contacto
                StringBuilder contactBuilder = new StringBuilder();
                if (personal.getEmail() != null && !personal.getEmail().isBlank()) contactBuilder.append("Email: ").append(personal.getEmail()).append("   ");
                if (personal.getTelefono() != null && !personal.getTelefono().isBlank()) contactBuilder.append("Tel: ").append(personal.getTelefono()).append("   ");
                if (personal.getUbicacion() != null && !personal.getUbicacion().isBlank()) contactBuilder.append("Ubicación: ").append(personal.getUbicacion()).append("   ");
                if (personal.getLinkedin() != null && !personal.getLinkedin().isBlank()) contactBuilder.append("LinkedIn: ").append(personal.getLinkedin());

                if (contactBuilder.length() > 0) {
                    Paragraph pContact = new Paragraph(contactBuilder.toString(), contactFont);
                    pContact.setSpacingAfter(10);
                    document.add(pContact);
                }

                // Línea divisoria del header
                LineSeparator lineHeader = new LineSeparator(1.5f, 100, primaryColor, Element.ALIGN_CENTER, -2);
                document.add(lineHeader);
                document.add(Chunk.NEWLINE);

                // Perfil / Resumen
                if (personal.getResumen() != null && !personal.getResumen().isBlank()) {
                    addSectionHeader(document, "PERFIL PROFESIONAL", sectionHeaderFont, primaryColor);
                    Paragraph pResumen = new Paragraph(personal.getResumen(), bodyFont);
                    pResumen.setSpacingAfter(14);
                    document.add(pResumen);
                }
            }

            // Experiencia Laboral
            List<ExperienceDto> experiencias = request.getExperiencias();
            if (experiencias != null && !experiencias.isEmpty()) {
                addSectionHeader(document, "EXPERIENCIA LABORAL", sectionHeaderFont, primaryColor);

                for (ExperienceDto exp : experiencias) {
                    PdfPTable expTable = new PdfPTable(2);
                    expTable.setWidthPercentage(100);
                    expTable.setWidths(new float[]{75, 25});

                    PdfPCell titleCell = new PdfPCell(new Phrase(exp.getPuesto() != null ? exp.getPuesto() : "", bodyBoldFont));
                    titleCell.setBorder(Rectangle.NO_BORDER);

                    PdfPCell dateCell = new PdfPCell(new Phrase(exp.getFecha() != null ? exp.getFecha() : "", dateFont));
                    dateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    dateCell.setBorder(Rectangle.NO_BORDER);

                    expTable.addCell(titleCell);
                    expTable.addCell(dateCell);
                    document.add(expTable);

                    if (exp.getEmpresa() != null || exp.getUbicacion() != null) {
                        String empUbic = (exp.getEmpresa() != null ? exp.getEmpresa() : "") + (exp.getUbicacion() != null ? " • " + exp.getUbicacion() : "");
                        Paragraph pEmp = new Paragraph(empUbic, dateFont);
                        pEmp.setSpacingAfter(4);
                        document.add(pEmp);
                    }

                    if (exp.getDescripcion() != null && !exp.getDescripcion().isBlank()) {
                        Paragraph pDesc = new Paragraph(exp.getDescripcion(), bodyFont);
                        pDesc.setSpacingAfter(10);
                        document.add(pDesc);
                    }
                }
                document.add(Chunk.NEWLINE);
            }

            // Educación y Habilidades
            List<EducationDto> educaciones = request.getEducacion();
            List<String> habilidades = request.getHabilidades();

            if ((educaciones != null && !educaciones.isEmpty()) || (habilidades != null && !habilidades.isEmpty())) {
                PdfPTable twoColTable = new PdfPTable(2);
                twoColTable.setWidthPercentage(100);
                twoColTable.setWidths(new float[]{50, 50});

                // Columna 1: Educación
                PdfPCell eduCell = new PdfPCell();
                eduCell.setBorder(Rectangle.NO_BORDER);
                eduCell.setPaddingRight(10);

                if (educaciones != null && !educaciones.isEmpty()) {
                    Paragraph pEduTitle = new Paragraph("EDUCACIÓN", sectionHeaderFont);
                    pEduTitle.setSpacingAfter(6);
                    eduCell.addElement(pEduTitle);

                    for (EducationDto edu : educaciones) {
                        Paragraph pEduGrad = new Paragraph(edu.getTitulo() != null ? edu.getTitulo() : "", bodyBoldFont);
                        Paragraph pEduSchool = new Paragraph((edu.getColegio() != null ? edu.getColegio() : "") + (edu.getFecha() != null ? " (" + edu.getFecha() + ")" : ""), bodyFont);
                        pEduSchool.setSpacingAfter(8);
                        eduCell.addElement(pEduGrad);
                        eduCell.addElement(pEduSchool);
                    }
                }

                // Columna 2: Habilidades
                PdfPCell habCell = new PdfPCell();
                habCell.setBorder(Rectangle.NO_BORDER);
                habCell.setPaddingLeft(10);

                if (habilidades != null && !habilidades.isEmpty()) {
                    Paragraph pHabTitle = new Paragraph("HABILIDADES", sectionHeaderFont);
                    pHabTitle.setSpacingAfter(6);
                    habCell.addElement(pHabTitle);

                    String listaHab = String.join(" • ", habilidades);
                    Paragraph pHabList = new Paragraph(listaHab, bodyFont);
                    habCell.addElement(pHabList);
                }

                twoColTable.addCell(eduCell);
                twoColTable.addCell(habCell);
                document.add(twoColTable);
            }

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addSectionHeader(Document document, String title, Font font, Color color) throws DocumentException {
        Paragraph pTitle = new Paragraph(title, font);
        pTitle.setSpacingBefore(8);
        pTitle.setSpacingAfter(4);
        document.add(pTitle);

        LineSeparator line = new LineSeparator(1.0f, 100, color, Element.ALIGN_CENTER, -1);
        document.add(line);
        document.add(Chunk.NEWLINE);
    }

    private Color parseColorHex(String colorHex) {
        try {
            if (colorHex != null && colorHex.startsWith("#")) {
                return Color.decode(colorHex);
            }
        } catch (Exception ignored) {}
        return new Color(0, 102, 84); // Default Profolio Green
    }
}
